define_key(content_buffer_normal_keymap, "C-u", "view-source");
define_key(content_buffer_normal_keymap, "C-t", "find-url-new-buffer");
define_key(content_buffer_normal_keymap, "C-w", "kill-current-buffer");
define_key(content_buffer_normal_keymap, "T", "follow-new-buffer");
define_key(content_buffer_normal_keymap, "M-left", "back");
define_key(content_buffer_normal_keymap, "M-right", "forward");
define_key(default_global_keymap, "C-f", "isearch-forward"); 
define_key(isearch_keymap, "C-f", "isearch-continue-forward");
