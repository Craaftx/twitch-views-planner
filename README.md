# Twitch Views Planner

Enter Streams URL with start & end date if you want. The script open streams when needed and close it when finish. The script refresh streams each `refreshDelay` present in config.json

## Prerequisites

Download & install the last version of [Node.js](https://nodejs.org/en/)

## Installation

Clone the repository and launch installation of dependencies

```bash
npm install
```

## Usage

Fill the config.json with your parameters

```json
{
  "browser": "chrome",
  "refreshDelay": 2,
  "streams": [
    {
      "url": "https://www.twitch.tv",
      "start": 8,
      "end": 18
    }
  ]
}
```

And launch the script with node

```bash
node index.js
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
