const { Configuration, OpenAIApi } = require("openai");
const asyncHandler = require("express-async-handler");
const Argument = require("../models/argumentsModel");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const arguments = {};

const saveArgument = asyncHandler(async (req, res) => {
  const { username, convoID } = req.body;

  const argument = arguments[convoID].argument;

  const alreadySaved = await Argument.findOne({ username });

  if (alreadySaved) {
    res.status(400);
    throw new Error("Argument already saved");
  }

  const createdArgument = await Argument.create({
    argument,
    username,
  });

  if (createdArgument) {
    res.status(201).json({
      id: createdArgument.id,
      username: createdArgument.username,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const getNextArgument = asyncHandler(async (req, res) => {
  const { convoID } = req.body;
  console.log(convoID);

  if (!arguments[convoID]) {
    arguments[convoID] = {
      argument: [],
      nextArgumentIndex: 0,
    };
  }

  if (
    arguments[convoID].argument.length === arguments[convoID].nextArgumentIndex
  ) {
    const nextArguments = await getResponse({ ...req.body, res });
    arguments[convoID].argument.push(...nextArguments);
  }

  console.log(arguments);
  console.log(req.body.name + ":");

  let nextArgument =
    arguments[convoID].argument[arguments[convoID].nextArgumentIndex];
  arguments[convoID].nextArgumentIndex++;
  if (nextArgument.toLowerCase() === req.body.name.toLowerCase() + ":") {
    nextArgument +=
      " " + arguments[convoID].argument[arguments[convoID].nextArgumentIndex];
    arguments[convoID].nextArgumentIndex++;
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
      .filter((arg) => arg !== "" && arg !== " ");
  }
);

module.exports = getNextArgument;
