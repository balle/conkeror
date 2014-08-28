require("session");

// adblock
require("adblockplus");
try { require("dom-inspector"); } catch (e) {}

/* noscript */
require("noscript");

function ns_allow_perm (url, buffer, P, allow) {
    var ns = noscript_service;
    if (allow) {
        ns.setJSEnabled(url, true);
        setObjectVisibility(buffer.document,showObject);
    } else {
        ns.setJSEnabled(url, false);
        setObjectVisibility(buffer.document,hideObject);
    }
}

interactive("ns-toggle-perm",
    "Allow a site permanently access to javascript",
    function (I) {
        var ns = noscript_service;
        var urls = [];
        var level = ns.getPref("toolbarToggle", 3);
        if (! level)
            level = 3;
        var url = ns.getQuickSite(I.buffer.document.documentURI, level);
        var url2;
        if (url) {
            urls.push(url);
            var scripts = I.buffer.document.getElementsByTagName("script");
            for (var i = 0, n = scripts.length; i < n; i++) {
                if (scripts[i].getAttribute("src")) {
                    var matches = scripts[i].getAttribute("src").split("/");
                    if (matches[0] == "http:")
                        urls.push(matches[2]);
                }
            }
            urls = unique(urls);
            urls = urls.filter(function (u) { return !ns.isJSEnabled(u); });
            while ((url2 = urls.pop())) {
                ns_allow_perm(url2, I.buffer, I.P,
                              "y" == (yield I.minibuffer.read_single_character_option(
                                  $prompt = "Allow " + url2 + "? [y/[n]]",
                                  $options = ["y", "n"])));
            }
            reload(I.buffer, I.P);
        }
    });


/* flashblock */
let (sheet = get_home_directory()) {
    sheet.appendRelativePath(".conkerorrc/css/flashblock.css");
    register_user_stylesheet(make_uri(sheet));
}

/*
require("content-policy");

function block_flash (content_type, content_location)
{
    var action = content_policy_reject;
    var allowed_sites = new Array("www.youtube.com",
                                  "www.vimeo.com");

    for(var i=0; i < allowed_sites.length; ++i)
    {
       if (content_location.host == allowed_sites[i])
       {
          action = content_policy_accept ;
       }
    }

    return action;
}

content_policy_bytype_table.object = block_flash;
add_hook("content_policy_hook", content_policy_bytype);
*/

// RSS
require("utils.js");

function subscribe_feed(I){
    var f=false;
    var document= I.buffer.document;
    var ls=document.getElementsByTagName("link");
    for(var i=0,l;l=ls[i];i++){
        var t=l.getAttribute('type');
        var r=l.getAttribute('rel');
        if(t&&(t=='application/rss+xml'||t=='application/xml+rss'||t=='application/atom+xml')&&r&&r=='alternate'){
            var h= l.getAttribute('href');
            dumpln("MUH " + h)
            if(h.indexOf('http') != 0){
                var p=(h.indexOf('/')!=0)?'/':document.location.pathname;
                h='http://'+document.location.hostname+p+h;
            }
            writeToClipboard(h);
            I.minibuffer.message("Found RSS feed " + h);
            f=true;
        }}
    if(!f) I.minibuffer.message('Oops. Can\'t find a feed.');
};
interactive("subscribe_feed", "Copy first RSS feed to clipboard", subscribe_feed);
define_key(default_global_keymap, "C-c s", "subscribe_feed");


// direct switch to buffers
function define_switch_buffer_key (key, buf_num) {
    define_key(default_global_keymap, key,
               function (I) {
                   switch_to_buffer(I.window,
                                    I.window.buffers.get_buffer(buf_num));
               });
};
for (let i = 0; i < 10; ++i) {
    define_switch_buffer_key("M-"+String((i+1)%10), i);
};
