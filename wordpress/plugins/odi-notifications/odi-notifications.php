<?php
/**
 * Plugin Name: ODI Notifications
 * Description: Pings a webhook endpoint when posts or pages are published, updated, or trashed. Replaces the BracketSpace Notification plugin and its Webhooks extension for this site's single use case.
 * Plugin URI:  https://github.com/cagov
 * Author:      Office of Data and Innovation
 * Author URI:  https://innovation.ca.gov
 * Version:     1.0.0
 * License:     MIT
 * Text Domain: odi-notifications
 *
 * @package ODINotifications
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

final class ODI_Notifications
{
    public const OPTION = 'odi_notifications_settings';
    public const CAP    = 'manage_options';

    /**
     * Event key => human label. Keys are <post_type>_<event>.
     *
     * @var array<string,string>
     */
    public const EVENTS = [
        'post_published' => 'Post published',
        'page_published' => 'Page published',
        'post_updated'   => 'Post updated',
        'page_updated'   => 'Page updated',
        'post_trashed'   => 'Post trashed',
        'page_trashed'   => 'Page trashed',
    ];

    public static function boot(): void
    {
        $self = new self();
        add_action('admin_init', [$self, 'registerSettings']);
        add_action('admin_menu', [$self, 'registerPage']);
        add_action('admin_post_odi_notifications_test', [$self, 'handleTestPing']);
        add_action('transition_post_status', [$self, 'onTransition'], 10, 3);
    }

    /**
     * @return array{url:string,events:array<int,string>,payload:string,dry_run:bool,logging:bool}
     */
    public static function settings(): array
    {
        $saved = get_option(self::OPTION, []);
        if (!is_array($saved)) {
            $saved = [];
        }

        return [
            'url'     => isset($saved['url']) ? (string) $saved['url'] : '',
            'events'  => isset($saved['events']) && is_array($saved['events'])
                ? array_values(array_intersect($saved['events'], array_keys(self::EVENTS)))
                : [],
            'payload' => isset($saved['payload']) ? (string) $saved['payload'] : '',
            // Default to dry run so an incomplete install cannot fire real traffic.
            'dry_run' => !isset($saved['dry_run']) || (bool) $saved['dry_run'],
            'logging' => isset($saved['logging']) && (bool) $saved['logging'],
        ];
    }

    // ---------------------------------------------------------------- settings

    public function registerSettings(): void
    {
        register_setting(
            'odi_notifications',
            self::OPTION,
            ['sanitize_callback' => [$this, 'sanitize'], 'default' => []]
        );
    }

    /**
     * @param  mixed $input Raw submitted value.
     * @return array<string,mixed>
     */
    public function sanitize($input): array
    {
        $input = is_array($input) ? $input : [];

        $url = isset($input['url']) ? esc_url_raw(trim((string) $input['url'])) : '';
        if ($url !== '' && !wp_http_validate_url($url)) {
            add_settings_error(
                self::OPTION,
                'odi_bad_url',
                __('That endpoint URL is not valid; it was not saved.', 'odi-notifications')
            );
            $url = '';
        }

        $events = [];
        if (isset($input['events']) && is_array($input['events'])) {
            $events = array_values(
                array_intersect(array_map('sanitize_key', $input['events']), array_keys(self::EVENTS))
            );
        }

        return [
            'url'     => $url,
            'events'  => $events,
            'payload' => isset($input['payload']) ? trim((string) $input['payload']) : '',
            'dry_run' => !empty($input['dry_run']),
            'logging' => !empty($input['logging']),
        ];
    }

    public function registerPage(): void
    {
        add_options_page(
            __('ODI Notifications', 'odi-notifications'),
            __('ODI Notifications', 'odi-notifications'),
            self::CAP,
            'odi-notifications',
            [$this, 'renderPage']
        );
    }

    public function renderPage(): void
    {
        if (!current_user_can(self::CAP)) {
            return;
        }

        $s = self::settings();
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('ODI Notifications', 'odi-notifications'); ?></h1>
            <p>
                <?php esc_html_e('Sends an HTTP POST to the endpoint below whenever one of the selected events occurs.', 'odi-notifications'); ?>
            </p>

            <?php settings_errors(self::OPTION); ?>

            <form method="post" action="options.php">
                <?php settings_fields('odi_notifications'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">
                            <label for="odi-url"><?php esc_html_e('Endpoint URL', 'odi-notifications'); ?></label>
                        </th>
                        <td>
                            <input name="<?php echo esc_attr(self::OPTION); ?>[url]" id="odi-url" type="url"
                                   class="regular-text code" value="<?php echo esc_attr($s['url']); ?>"
                                   placeholder="https://example.execute-api.us-west-1.amazonaws.com">
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Fire on', 'odi-notifications'); ?></th>
                        <td><fieldset>
                            <?php foreach (self::EVENTS as $key => $label) : ?>
                                <label style="display:inline-block;min-width:16em;margin-bottom:.35em;">
                                    <input type="checkbox"
                                           name="<?php echo esc_attr(self::OPTION); ?>[events][]"
                                           value="<?php echo esc_attr($key); ?>"
                                        <?php checked(in_array($key, $s['events'], true)); ?>>
                                    <?php echo esc_html($label); ?>
                                </label>
                            <?php endforeach; ?>
                        </fieldset></td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="odi-payload"><?php esc_html_e('Request body', 'odi-notifications'); ?></label>
                        </th>
                        <td>
                            <textarea name="<?php echo esc_attr(self::OPTION); ?>[payload]" id="odi-payload"
                                      rows="3" class="large-text code"><?php echo esc_textarea($s['payload']); ?></textarea>
                            <p class="description">
                                <?php esc_html_e('Sent verbatim with Content-Type: application/json. Leave empty to send an empty body (this matches the previous plugin).', 'odi-notifications'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e('Safety', 'odi-notifications'); ?></th>
                        <td><fieldset>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(self::OPTION); ?>[dry_run]"
                                       value="1" <?php checked($s['dry_run']); ?>>
                                <strong><?php esc_html_e('Dry run', 'odi-notifications'); ?></strong>
                                &mdash; <?php esc_html_e('log what would be sent, send nothing', 'odi-notifications'); ?>
                            </label><br>
                            <label>
                                <input type="checkbox" name="<?php echo esc_attr(self::OPTION); ?>[logging]"
                                       value="1" <?php checked($s['logging']); ?>>
                                <?php esc_html_e('Log every send and its response to the PHP error log', 'odi-notifications'); ?>
                            </label>
                        </fieldset></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>

            <hr>
            <h2><?php esc_html_e('Send a test ping', 'odi-notifications'); ?></h2>
            <p class="description">
                <?php esc_html_e('Uses the saved settings. Respects dry run.', 'odi-notifications'); ?>
            </p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="odi_notifications_test">
                <?php wp_nonce_field('odi_notifications_test'); ?>
                <?php submit_button(__('Send test ping', 'odi-notifications'), 'secondary', 'submit', false); ?>
            </form>
        </div>
        <?php
    }

    public function handleTestPing(): void
    {
        if (!current_user_can(self::CAP)) {
            wp_die(esc_html__('Insufficient permissions.', 'odi-notifications'));
        }

        check_admin_referer('odi_notifications_test');

        // Blocking, so the admin gets a real HTTP status back.
        $result = $this->dispatch('test-ping', null, true);
        $status = is_wp_error($result) ? 'error' : 'ok';
        $detail = is_wp_error($result) ? $result->get_error_message() : (string) $result;

        wp_safe_redirect(
            add_query_arg(
                [
                    'page'           => 'odi-notifications',
                    'odi_test'       => $status,
                    'odi_test_detail' => rawurlencode($detail),
                ],
                admin_url('options-general.php')
            )
        );
        exit;
    }

    // ----------------------------------------------------------------- sending

    /**
     * @param string   $newStatus New post status.
     * @param string   $oldStatus Previous post status.
     * @param \WP_Post $post      Post object.
     */
    public function onTransition($newStatus, $oldStatus, $post): void
    {
        if (!$post instanceof WP_Post) {
            return;
        }

        if (!in_array($post->post_type, ['post', 'page'], true)) {
            return;
        }

        if (wp_is_post_revision($post) || wp_is_post_autosave($post)) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        $event = $this->classify($newStatus, $oldStatus, $post->post_type);
        if ($event === null) {
            return;
        }

        $settings = self::settings();
        if (!in_array($event, $settings['events'], true)) {
            return;
        }

        if ($this->isDuplicate($event, (int) $post->ID, $settings)) {
            return;
        }

        // Non-blocking: the endpoint runs a full sync inline and can take minutes.
        // We only need to trigger it, not wait for it.
        $this->dispatch($event, $post->ID, false);
    }

    /**
     * Collapses the burst of saves the block editor issues for a single user
     * action. Gutenberg typically fires two transitions a second or so apart,
     * and each one would otherwise start a full sync run.
     *
     * Must be persistent (the saves are separate requests), so a transient.
     *
     * @param  array{logging:bool} $settings Settings array.
     * @return bool True when this event should be suppressed.
     */
    private function isDuplicate(string $event, int $postId, array $settings): bool
    {
        /**
         * Seconds during which a repeat of the same event for the same post is
         * suppressed. Return 0 to disable suppression entirely.
         *
         * @param int $seconds Window length.
         */
        $window = (int) apply_filters('odi_notifications_dedupe_window', 10);

        if ($window <= 0) {
            return false;
        }

        $key = 'odi_notif_' . md5($event . '|' . $postId);

        if (get_transient($key) !== false) {
            $this->log(
                sprintf('suppressed duplicate %s post=%d (within %ds)', $event, $postId, $window),
                $settings
            );
            return true;
        }

        set_transient($key, 1, $window);

        return false;
    }

    /**
     * Maps a status transition onto one of our event keys.
     */
    private function classify(string $newStatus, string $oldStatus, string $postType): ?string
    {
        if ($newStatus === 'trash') {
            return $postType . '_trashed';
        }

        if ($newStatus !== 'publish') {
            return null;
        }

        return $oldStatus === 'publish'
            ? $postType . '_updated'
            : $postType . '_published';
    }

    /**
     * Performs the POST (or logs it, under dry run).
     *
     * @param  string   $event    Event key, for logging.
     * @param  int|null  $postId   Post that triggered it, if any.
     * @param  bool      $blocking Wait for the response. False for event-driven
     *                             sends (the endpoint syncs inline and is slow);
     *                             true for the manual test ping.
     * @return string|WP_Error     Short status string, or WP_Error on transport failure.
     */
    private function dispatch(string $event, ?int $postId = null, bool $blocking = false)
    {
        $settings = self::settings();
        $url      = $settings['url'];

        if ($url === '') {
            $this->log(sprintf('skipped %s (no endpoint configured)', $event), $settings);
            return new WP_Error('odi_no_url', __('No endpoint URL is configured.', 'odi-notifications'));
        }

        $context = sprintf('%s%s', $event, $postId !== null ? ' post=' . $postId : '');

        if ($settings['dry_run']) {
            $this->log(
                sprintf('DRY RUN would POST to %s [%s] body=%s', $url, $context, wp_json_encode($settings['payload'])),
                $settings,
                true
            );
            return 'dry-run (nothing sent)';
        }

        $response = wp_remote_post(
            $url,
            [
                'blocking'    => $blocking,
                'timeout'     => $blocking ? 30 : 5,
                'redirection' => 0,
                'headers'     => ['Content-Type' => 'application/json'],
                'body'        => $settings['payload'],
                'user-agent'  => 'ODI-Notifications/1.0; ' . home_url('/'),
            ]
        );

        if (!$blocking && !is_wp_error($response)) {
            $this->log(sprintf('dispatched %s -> %s (non-blocking)', $context, $url), $settings);
            return 'dispatched (non-blocking)';
        }

        if (is_wp_error($response)) {
            $this->log(sprintf('FAILED %s -> %s: %s', $context, $url, $response->get_error_message()), $settings, true);
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $this->log(sprintf('sent %s -> %s: HTTP %s', $context, $url, $code), $settings);

        return sprintf('HTTP %s', $code);
    }

    /**
     * @param array{logging:bool} $settings Settings array.
     */
    private function log(string $message, array $settings, bool $always = false): void
    {
        if (!$always && empty($settings['logging'])) {
            return;
        }

        error_log('[odi-notifications] ' . $message); // phpcs:ignore WordPress.PHP.DevelopmentFunctions
    }
}

ODI_Notifications::boot();

add_action(
    'admin_notices',
    static function (): void {
        if (!current_user_can(ODI_Notifications::CAP)) {
            return;
        }

        $screen = get_current_screen();
        if ($screen === null || $screen->id !== 'settings_page_odi-notifications') {
            return;
        }

        if (!isset($_GET['odi_test'])) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            return;
        }

        $ok     = sanitize_key(wp_unslash($_GET['odi_test'])) === 'ok'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $detail = isset($_GET['odi_test_detail']) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            ? sanitize_text_field(rawurldecode(wp_unslash($_GET['odi_test_detail']))) // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            : '';

        printf(
            '<div class="notice notice-%s is-dismissible"><p><strong>%s</strong> %s</p></div>',
            $ok ? 'success' : 'error',
            esc_html($ok ? __('Test ping:', 'odi-notifications') : __('Test ping failed:', 'odi-notifications')),
            esc_html($detail)
        );
    }
);
