# Torn Item Market Pricing

A Tampermonkey userscript for [Torn.com](https://www.torn.com) that helps traders and casual sellers quickly price their items on the Item Market.

## Features

- **Automated Pricing**: Automatically fetches the current lowest market price for an item when you click the "Price" input field.
- **Undercutting**: Automatically sets the price to be 1 dollar lower than the current lowest price.
- **Visual Feedback**: The input field glows green while fetching and updating the price.
- **Safe Interaction**: Respects existing input—will not overwrite if you have already typed a price.
- **Secure**: Stores your API key safely using Tampermonkey's storage.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey.
3. Copy the contents of `torn_market_pricing.user.js` into the editor.
4. Save the script.

## Usage

1. Go to the [Torn Item Market Add Listing Page](https://www.torn.com/page.php?sid=ItemMarket#/addListing).
2. Click on the **Price** field for any item you wish to sell.
3. The first time you run the script, you will be prompted to enter your **Torn API Key**.
   - You can generate a key with `Market` access at [Torn API Settings](https://www.torn.com/preferences.php#tab=api).
4. Watch the magic happen! The script will fetch the latest price and populate the field.

## Configuration

You can customize the script by editing the following variable at the top of the file:

```javascript
const UNDERCUT_DELTA = -1; // Amount to subtract from the lowest market price
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
