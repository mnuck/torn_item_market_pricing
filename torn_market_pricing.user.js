// ==UserScript==
// @name         Torn Item Market Pricing
// @namespace    https://github.com/mnuck/torn_item_market_pricing
// @version      1.0
// @description  Helps set prices for items on the item market in torn.com by fetching the lowest market price and undercutting it.
// @author       Matthew Nuckolls <matthew.nuckolls@gmail.com>
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @match        https://www.torn.com/page.php?sid=ItemMarket#/addListing
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// ==/UserScript==

(function () {
    'use strict';

    const UNDERCUT_DELTA = -1;
    const API_KEY_KEY = 'torn_api_key';

    function getApiKey() {
        let apiKey = GM_getValue(API_KEY_KEY);
        if (!apiKey) {
            apiKey = prompt("Please enter your Torn API Key for the Item Market Pricing script:");
            if (apiKey) {
                GM_setValue(API_KEY_KEY, apiKey);
            }
        }
        return apiKey;
    }

    function fetchItemPrice(itemId, callback) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error("No API key available.");
            return;
        }

        const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?limit=20`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "accept": "application/json",
                "Authorization": `ApiKey ${apiKey}`
            },
            onload: (response) => handleApiResponse(response, itemId, callback),
            onerror: (err) => console.error("GM_xmlhttpRequest error", err)
        });
    }

    function handleApiResponse(response, itemId, callback) {
        if (response.status !== 200) {
            console.error("API error:", response.status, response.statusText);
            console.log("Response:", response.responseText);
            return;
        }

        let data;
        try {
            data = JSON.parse(response.responseText);
        } catch (e) {
            console.error("Error parsing API response", e);
            return;
        }

        console.debug("API Response Data (v2):", data);

        if (!data.itemmarket ||
            !Array.isArray(data.itemmarket.listings) ||
            data.itemmarket.listings.length === 0) {
            console.warn(`No market listings found for item ${itemId}.`);
            console.debug("Raw Response:", data);
            return;
        }

        const listings = data.itemmarket.listings;
        // v2 API returns 'price' field
        const prices = listings.map(listing => listing.price);
        const lowestPrice = Math.min(...prices);
        callback(lowestPrice);
    }

    console.debug("Torn Item Market Pricing script loaded");

    document.addEventListener('click', function (event) {
        const target = event.target;

        if (target.tagName !== 'INPUT') return;
        if (!['text', 'number', 'tel'].includes(target.type)) return;
        if (target.getAttribute('placeholder') !== 'Price') return;
        if (target.value && target.value.trim() !== '') return;

        console.debug("Identified Price input.");

        const rowContainer = target.closest('[class*="item"]');
        if (!rowContainer) {
            console.warn("Could not find row container.");
            return;
        }

        // Find Item ID via img src
        const img = rowContainer.querySelector('img[src*="/images/items/"]');
        if (!img) {
            console.warn("Could not find item image for ID extraction.");
            return;
        }

        const match = img.getAttribute('src').match(/items\/(\d+)/);
        if (!match) {
            console.warn("Could not extract ID from image src.");
            return;
        }

        const itemId = match[1];
        console.debug(`Price field clicked for Item ID: ${itemId}`);

        target.style.setProperty('outline', '2px solid #28a745', 'important');
        fetchItemPrice(itemId, function (lowestPrice) {
            const myPrice = lowestPrice + UNDERCUT_DELTA;
            target.value = myPrice;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));
        });
        target.style.removeProperty('outline');
    });

})();
