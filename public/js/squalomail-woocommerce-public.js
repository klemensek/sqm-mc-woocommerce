var squalomail,
    squalomail_cart,
    squalomail_billing_email,
    squalomail_username_email,
    squalomail_registration_email,
    squalomail_submitted_email = false,
    squalomailReady = function (a) { /in/.test(document.readyState) ? setTimeout("squalomailReady(" + a + ")", 9) : a(); };

function squalomailGetCurrentUserByHash(a) {
    try {
        var b = squalomail_public_data.ajax_url + "?action=squalomail_get_user_by_hash&hash=" + a, c = new XMLHttpRequest;
        c.open("POST", b, !0), c.onload = function () {
            if (c.status >= 200 && c.status < 400) {
                var a = JSON.parse(c.responseText);
                if (!a) return;
                squalomail_cart.valueEmail(a.email) && squalomail_cart.setEmail(a.email);
            }
        };
        c.onerror = function () {
            console.log("squalomail.get_email_by_hash.request.error", c.responseText)
        };
        c.setRequestHeader("Content-Type", "application/json");
        c.setRequestHeader("Accept", "application/json");
        c.send();
    } catch (a) {
        console.log("squalomail.get_email_by_hash.error", a)
    }
}
function squalomailHandleBillingEmail(selector) {
    try {
        if (!selector) selector = "#billing_email";
        var a = document.querySelector(selector);
        var b = void 0 !== a ? a.value : "";
        if (!squalomail_cart.valueEmail(b) || squalomail_submitted_email === b) { return false; }
        squalomail_cart.setEmail(b);
        var c = squalomail_public_data.ajax_url + "?action=squalomail_set_user_by_email&email=" + b + "&sqm_language=" + squalomail_public_data.language;
        var d = new XMLHttpRequest;
        d.open("POST", c, !0);
        d.onload = function () {
            var successful = d.status >= 200 && d.status < 400;
            var msg = successful ? "squalomail.handle_billing_email.request.success" : "squalomail.handle_billing_email.request.error";
            if (successful) {
                squalomail_submitted_email = b;
            }
            console.log(msg, d.responseText);
        };
        d.onerror = function () {
            console.log("squalomail.handle_billing_email.request.error", d.responseText)
        };
        d.setRequestHeader("Content-Type", "application/json");
        d.setRequestHeader("Accept", "application/json");
        d.send();
        return true;
    } catch (a) {
        console.log("squalomail.handle_billing_email.error", a); squalomail_submitted_email = !1
    }
}

!function () {
    "use strict";

    function squalomailCart() {

        this.email_types = "input[type=email]";
        this.regex_email = /^([A-Za-z0-9_+\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        this.current_email = null;
        this.previous_email = null;
        this.expireUser = function () {
            this.current_email = null;
            squalomail.storage.expire("squalomail.cart.current_email");
        };
        this.expireSaved = function () {
            squalomail.storage.expire("squalomail.cart.items");
        };
        this.setEmail = function (a) {
            if (!this.valueEmail(a)) return false;
            this.setPreviousEmail(this.getEmail());
            squalomail.storage.set("squalomail.cart.current_email", this.current_email = a);
        };
        this.getEmail = function () {
            if (this.current_email) return this.current_email;
            var a = squalomail.storage.get("squalomail.cart.current_email", !1);
            if (!a || !this.valueEmail(a)) return false;
            return this.current_email = a;
        };
        this.setPreviousEmail = function (a) {
            if (!this.valueEmail(a)) return false;
            squalomail.storage.set("squalomail.cart.previous_email", this.previous_email = a);
        };
        this.valueEmail = function (a) {
            return this.regex_email.test(a);
        };
        return this;
    }

    var g = {
        extend: function (a, b) {
            for (var c in b || {})b.hasOwnProperty(c) && (a[c] = b[c]);
            return a
        }, getQueryStringVars: function () {
            var a = window.location.search || "", b = [], c = {};
            if (a = a.substr(1), a.length) {
                b = a.split("&");
                for (var d in b) {
                    var e = b[d];
                    if ("string" == typeof e) {
                        var f = e.split("="), g = f[0], h = f[1];
                        g.length && ("undefined" == typeof c[g] && (c[g] = []), c[g].push(h))
                    }
                }
            }
            return c
        }, unEscape: function (a) {
            return decodeURIComponent(a)
        }, escape: function (a) {
            return encodeURIComponent(a)
        }, createDate: function (a, b) {
            a || (a = 0);
            var c = new Date, d = b ? c.getDate() - a : c.getDate() + a;
            return c.setDate(d), c
        }, arrayUnique: function (a) {
            for (var b = a.concat(), c = 0; c < b.length; ++c)for (var d = c + 1; d < b.length; ++d)b[c] === b[d] && b.splice(d, 1);
            return b
        }, objectCombineUnique: function (a) {
            for (var b = a[0], c = 1; c < a.length; c++) {
                var d = a[c];
                for (var e in d)b[e] = d[e]
            }
            return b
        }
    }, h = function (a, b) {
        var c = function (a, b, d) {
            return 1 === arguments.length ? c.get(a) : c.set(a, b, d)
        };
        return c.get = function (b, d) {
            return a.cookie !== c._cacheString && c._populateCache(), void 0 == c._cache[b] ? d : c._cache[b]
        }, c.defaults = {path: "/", secure: true, samesite: 'strict'}, c.set = function (d, e, f) {
            switch (f = {
                path: f && f.path || c.defaults.path,
                domain: f && f.domain || c.defaults.domain,
                expires: f && f.expires || c.defaults.expires,
                secure: f && f.secure !== b ? f.secure : c.defaults.secure,
                samesite: f && f.samesite || c.defaults.samesite,
            }, e === b && (f.expires = -1), typeof f.expires) {
                case"number":
                    f.expires = new Date((new Date).getTime() + 1e3 * f.expires);
                    break;
                case"string":
                    f.expires = new Date(f.expires)
            }
            return d = encodeURIComponent(d) + "=" + (e + "").replace(/[^!#-+\--:<-\[\]-~]/g, encodeURIComponent), d += f.path ? ";path=" + f.path : "", d += f.domain ? ";domain=" + f.domain : "", d += f.expires ? ";expires=" + f.expires.toGMTString() : "", d += f.secure ? ";secure" : "", d += f.samesite ? (";samesite="+f.samesite) : '', a.cookie = d, c
        }, c.expire = function (a, d) {
            return c.set(a, b, d)
        }, c._populateCache = function () {
            c._cache = {};
            try {
                c._cacheString = a.cookie;
                for (var d = c._cacheString.split("; "), e = 0; e < d.length; e++) {
                    var f = d[e].indexOf("="), g = decodeURIComponent(d[e].substr(0, f)), f = decodeURIComponent(d[e].substr(f + 1));
                    c._cache[g] === b && (c._cache[g] = f)
                }
            } catch (a) {
                console.log(a)
            }
        }, c.enabled = function () {
            var a = "1" === c.set("cookies.js", "1").get("cookies.js");
            return c.expire("cookies.js"), a;
        }(), c
    }(document);

    squalomail = {storage: h, utils: g};
    squalomail_cart = new squalomailCart;
}();

squalomailReady(function () {

    if (void 0 === a) {
        var a = { site_url: document.location.origin, defaulted: !0, ajax_url: document.location.origin + "/wp-admin?admin-ajax.php" };
    }

    try {
        var b = squalomail.utils.getQueryStringVars();
        void 0 !== b.sqm_cart_id && squalomailGetCurrentUserByHash(b.sqm_cart_id);

        squalomail_username_email = document.querySelector("#username");
        squalomail_billing_email = document.querySelector("#billing_email");
        squalomail_registration_email = document.querySelector("#reg_email");

        if (squalomail_billing_email) {
            squalomail_billing_email.onblur = function () { squalomailHandleBillingEmail('#billing_email'); };
            squalomail_billing_email.onfocus = function () { squalomailHandleBillingEmail('#billing_email'); }
        }

        if (squalomail_username_email) {
            squalomail_username_email.onblur = function () { squalomailHandleBillingEmail('#username'); };
            squalomail_username_email.onfocus = function () { squalomailHandleBillingEmail('#username'); }
        }

        if (squalomail_registration_email) {
            squalomail_registration_email.onblur = function () { squalomailHandleBillingEmail('#reg_email'); };
            squalomail_registration_email.onfocus = function () { squalomailHandleBillingEmail('#reg_email'); }
        }

    } catch (e) {
        console.log('squalomail ready error', e);
    }
});

function emailFieldHasFocus(selector){
    if (!selector) selector = "#email";
    var field = document.querySelector(selector);
    if (!field) return;

    // Attach onblur and onfocus handlers
    field.onblur = function () {
        squalomailHandleBillingEmail(selector);
    };
    field.onfocus = function () {
        squalomailHandleBillingEmail(selector);
    };
}

window.addEventListener("load", (function () {
    if (window.wp && wp.hooks && typeof wp.hooks.addAction === "function") {
        wp.hooks.addAction(
            'experimental__woocommerce_blocks-checkout-set-email-address',
            'squalomail-woocommerce',
            () => {
                emailFieldHasFocus('#email');
            }
        );
    }
}));