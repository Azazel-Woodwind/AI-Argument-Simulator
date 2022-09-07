const { Configuration, OpenAIApi } = require("openai");
const asyncHandler = require("express-async-handler");
const Argument = require("../models/argumentsModel");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const arguments = {};

// @desc updates arguments with argument from argument id with given convoid
// @route PUT /api/arguments/next-argument/:id
// @access PRIVATE
const updateNextArgument = asyncHandler(async (req, res) => {
  const { convoID } = req.body;
  const argument = await Argument.findById(req.params.id);

  if (!argument) {
    res.status(400);
    throw new Error("Argument not found");
  }

  if (argument.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Access denied");
  }

  arguments[convoID] = {
    argument: argument.argument,
    nextArgumentIndex: 0,
  };

  res.status(200).json({ convoID });
});

// @desc deletes selected argument
// @route DELETE /api/arguments/:id
// @access PRIVATE
const deleteArgument = asyncHandler(async (req, res) => {
  const argument = await Argument.findById(req.params.id);

  if (!argument) {
    res.status(400);
    throw new Error("Argument not found");
  }

  if (argument.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Access denied");
  }

  await argument.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc sends back all arguments saved by logged in user
// @route GET /api/arguments
// @access PRIVATE
const getArguments = asyncHandler(async (req, res) => {
  const arguments = await Argument.find({ user: req.user.id });
  res.status(200).json(arguments);
});

// @desc saves argument
// @route POST /api/arguments
// @access PRIVATE
const saveArgument = asyncHandler(async (req, res) => {
  const { convoID, proposition, bot1Config, bot2Config } = req.body;
  console.log(arguments);
  console.log(convoID);

  const argument = arguments[convoID].argument;

  const createdArgument = await Argument.create({
    user: req.user._id,
    proposition,
    bot1Config,
    bot2Config,
    argument,
  });

  console.log(createdArgument);
  if (createdArgument) {
    res.status(201).json({ createdArgument });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

// @desc sends back next line in argument
// @route POST /api/arguments/next-argument
// @access PUBLIC
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

module.exports = {
  getNextArgument,
  saveArgument,
  getArguments,
  deleteArgument,
  updateNextArgument,
};
