import Community from "../models/communityModel.js";
import Member from "../models/memberModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Role from "../models/roleModel.js";

const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({}).sort({ createdAt: -1 });
  const pages = Math.ceil(communities.length / 10);
  res.json({
    status: true,
    content: {
      meta: {
        total: communities.length,
        pages: pages,
        page: 1,
      },
      data: communities,
    },
  });
});

const getAllMembers = asyncHandler(async (req, res) => {
  const community = await Community.findOne({ slug: req.params.id });
  const members = await Member.find({ community: community._id });
  const pages = Math.ceil(members.length / 10);
  res.json({
    status: true,
    content: {
      meta: {
        total: members.length,
        pages: pages,
        page: 1,
      },
      data: members,
    },
  });
});

const getMyCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({ owner: req.user._id });
  const pages = Math.ceil(communities.length / 10);
  res.json({
    status: true,
    content: {
      meta: {
        total: communities.length,
        pages: pages,
        page: 1,
      },
      data: communities,
    },
  });
});

const createCommunity = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const admin = await Role.findOne({ name: "Community Admin" });
  const comm = await Community.findOne({ name });
  if (!comm) {
    if (!name) {
      res.status(400);
      throw new Error("Community must have a name");
    } else {
      const community = new Community({
        name,
        slug: name.toLowerCase(),
        owner: req.user._id,
      });
      const member = new Member({
        community: community._id,
        user: req.user._id,
        role: admin._id,
      });
      await member.save();
      const createdCommunity = await community.save();
      res.status(201).json({
        status: true,
        content: {
          data: createdCommunity,
        },
      });
    }
  } else {
    res.status(401);
    throw new Error(
      "Community with provided name already in existence"
    );
  }
});

const getAllCommunities = asyncHandler(async (req, res) => {
  const comm = await Member.find({ user: req.user._id });

  const comms = comm.map((c) => c.community);

  const communityPromises = comms.map(async (c) => await Community.findById(c));
  const communities = await Promise.all(communityPromises);

  const pages = Math.ceil(communities.length / 10);
  res.json({
    status: true,
    content: {
      meta: {
        total: communities.length,
        pages: pages,
        page: 1,
      },
      data: communities,
    },
  });
});

export {
  getCommunities,
  getAllMembers,
  getMyCommunities,
  createCommunity,
  getAllCommunities,
};
