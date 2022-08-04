const { Configuration, OpenAIApi } = require("openai");
const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const arguments = {};

const getNextArgument = asyncHandler(async (req, res) => {
  const { convoID } = req.body;
  console.log(convoID);

  if (!arguments[convoID] || !arguments[convoID].length) {
    const nextArguments = await getResponse({ ...req.body, res });
    if (arguments[convoID]) {
      arguments[convoID].push(...nextArguments);
    } else {
      arguments[convoID] = [...nextArguments];
    }
  }

  console.log(arguments);
  console.log(req.body.name + ":");

  let nextArgument = arguments[convoID].shift();
  if (nextArgument.toLowerCase() === req.body.name.toLowerCase() + ":") {
    nextArgument += " " + arguments[convoID].shift();
  }

  res.status(200).json({ responseText: nextArgument });
});

const getResponse = asyncHandler(
  async ({ prompt, model, temp, freqPenalty, presPenalty, res }) => {
    let response;
    let max_tokens;
    if (model === "text-davinci-002") {
      max_tokens = 2000;
    } else {
      max_tokens = 1000;
    }
    try {
      response = await openai.createCompletion({
        model,
        prompt,
        temperature: parseFloat(temp),
        max_tokens,
        top_p: 1,
        frequency_penalty: parseFloat(freqPenalty),
        presence_penalty: parseFloat(presPenalty),
      });
    } catch (error) {
      console.log(1);
      res.status(500);
      throw new Error(error);
    }

    return response.data.choices[0].text
      .split("\n")
      .filter((arg) => arg !== "");
  }
);

module.exports = getNextArgument;
