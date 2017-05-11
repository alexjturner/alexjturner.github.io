/**!
 * Google Analytics Event Tracking
 * Note: Assuming that tracking code already exists on the page
 * Require jQuery 1.x or 2.x
 * Supports: Classic and Universal Google Analytics
 * @version 2.1.0
 * @license MIT
 * @author ankur
 */

(function (window) {
    'use strict';

    //jQuery Filter Ref: http://api.jquery.com/filter/
    jQuery(function ($) {

        //Track Downloads
        var exts = 'doc*|xls*|ppt*|pdf|zip|rar|exe|mp3';
        var regExt = new RegExp(".*\\.(" + exts + ")(\\?.*)?$");
        $('a').filter(function () {
            //include only internal links
            if (this.hostname && (this.hostname === window.location.hostname)) {
                return this.href.match(regExt);
            }
        }).prop('download', '') //force download of these files
            .click(function () {
                logClickEvent('Downloads', this.href)
            });

        //Track Mailto links
        $('a[href^="mailto"]').click(function () {
            //href should not include 'mailto'
            logClickEvent('Email', this.href.replace('mailto:', '').toLowerCase())
        });

        //Track Outbound Links
        $('a[href^="http"]').filter(function () {
            return (this.hostname && this.hostname !== window.location.hostname)
        }).prop('target', '_blank')  // make sure these links open in new tab
            .click(function (e) {
                logClickEvent('Outbound', this.href);
            });
    });

    /**
     * Detect Analytics type and send event
     * @ref https://support.google.com/analytics/answer/1033068
     * @param category string
     * @param label string
     */
    function logClickEvent(category, label) {
        if (window.ga && ga.create) {
            //Universal event tracking
            //https://developers.google.com/analytics/devguides/collection/analyticsjs/events
            ga('send', 'event', category, 'click', label, {
                nonInteraction: true
            });
        } else if (window._gaq && _gaq._getAsyncTracker) {
            //classic event tracking
            //https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
            _gaq.push(['_trackEvent', category, 'click', label, 1, true]);
        } else {
            console.info('Google analytics not found in this page')
        }
    }
})(window);
