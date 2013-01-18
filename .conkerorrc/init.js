// the default page for new buffers.
homepage = "about:blank";

// remember session
require("session");
session_auto_save_auto_load = "prompt";

// no history
session_pref('browser.history_expire_days', -1);
url_completion_use_history = false;

// completions
url_completion_use_webjumps = true;
url_completion_use_bookmarks = true;

// external programs for handling various mime types.
external_content_handlers.set("application/pdf", "acroread");

// view source in your editor.
editor_shell_command="emacsclient";
view_source_use_external_editor = true;

// passwords
session_pref("signon.rememberSignons", true);
session_pref("signon.expireMasterPassword", true);

// remember form values
session_pref("browser.formfill.enable", true);

// disable scrollbars
function disable_scrollbars (buffer) {
    buffer.top_frame.scrollbars.visible = false;
}
add_hook("create_buffer_late_hook", disable_scrollbars);

// dont show download buffer
remove_hook("download_added_hook", open_download_buffer_automatically);

session_pref('extensions.checkCompatibility', false);
session_pref("xpinstall.whitelist.required", false);
user_pref("extensions.checkUpdateSecurity", true);


///
/// Mode line preferences
///

// add favicons
require("favicon");
add_hook("mode_line_hook", mode_line_adder(buffer_icon_widget), true);
read_buffer_show_icons = true;

// hide clock
remove_hook("mode_line_hook", mode_line_adder(clock_widget));

// show buffer count in modeline
add_hook("mode_line_hook", mode_line_adder(buffer_count_widget), true);

// show loading buffer count widget
add_hook("mode_line_hook", mode_line_adder(loading_count_widget), true);

// show download status
add_hook("mode_line_hook", mode_line_adder(downloads_status_widget));





            
