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


///
/// Auto-hide Minibuffer
///

var minibuffer_autohide_timer = null;
var minibuffer_autohide_message_timeout = 3000; //milliseconds to show messages
var minibuffer_mutually_exclusive_with_mode_line = true;

function hide_minibuffer (window) {
    window.minibuffer.element.collapsed = true;
    if (minibuffer_mutually_exclusive_with_mode_line && window.mode_line)
        window.mode_line.container.collapsed = false;
}
interactive("hide_minibuffer", "Hide the minibuffer", hide_minibuffer);

function show_minibuffer (window) {
    window.minibuffer.element.collapsed = false;
    if (minibuffer_mutually_exclusive_with_mode_line && window.mode_line)
        window.mode_line.container.collapsed = true;
}
interactive("show_minibuffer", "Show the minibuffer", show_minibuffer);

add_hook("window_initialize_hook", hide_minibuffer);
// for_each_window(hide_minibuffer); // initialize existing windows


var old_minibuffer_restore_state = (old_minibuffer_restore_state ||
                                    minibuffer.prototype._restore_state);
minibuffer.prototype._restore_state = function () {
    if (minibuffer_autohide_timer) {
        timer_cancel(minibuffer_autohide_timer);
        minibuffer_autohide_timer = null;
    }
    if (this.current_state)
        show_minibuffer(this.window);
    else
        hide_minibuffer(this.window);
    old_minibuffer_restore_state.call(this);
};

var old_minibuffer_show = (old_minibuffer_show || minibuffer.prototype.show);
minibuffer.prototype.show = function (str, force) {
    var w = this.window;
    show_minibuffer(w);
    old_minibuffer_show.call(this, str, force);
    if (minibuffer_autohide_timer)
        timer_cancel(minibuffer_autohide_timer);
    minibuffer_autohide_timer = call_after_timeout(
        function () { hide_minibuffer(w); },
        minibuffer_autohide_message_timeout);
};

var old_minibuffer_clear = (old_minibuffer_clear || minibuffer.prototype.clear);
minibuffer.prototype.clear = function () {
    if (minibuffer_autohide_timer) {
        timer_cancel(minibuffer_autohide_timer);
        minibuffer_autohide_timer = null;
    }
    if (! this.current_state)
        hide_minibuffer(this.window);
    old_minibuffer_clear.call(this);
};



            
