const { Configuration, OpenAIApi } = require("openai");
const asyncHandler = require("express-async-handler");
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
    const nextArguments = await getResponse(req.body);
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

const getResponse = async ({
  prompt,
  model,
  temp,
  freqPenalty,
  presPenalty,
}) => {
  const response = await openai.createCompletion({
    model,
    prompt,
    temperature: temp,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: freqPenalty,
    presence_penalty: presPenalty,
  });

  return response.data.choices[0].text.split("\n").filter((arg) => arg !== "");
};

module.exports = getNextArgument;
