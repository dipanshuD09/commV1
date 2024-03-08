import Community from "../models/communityModel.js";
import Member from "../models/memberModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Role from "../models/roleModel.js";
import User from "../models/userModel.js";

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
  const roles = await Role.find({});
  const resultPromises = members.map(async (c) => await User.findById(c.user));
  const result = await Promise.all(resultPromises);

  const pages = Math.ceil(result.length / 10);

  const data = await Promise.all(
    members.map(async (x) => {
      const userQueryResult = await User.findById(x.user)
        .select("id name")
        .lean();
      const roleQueryResult = await Role.findById(x.role)
        .select("id name")
        .lean();

      return {
        id: x._id,
        community: x.community,
        user: {
          id: x.user,
          name: userQueryResult.name,
        },
        role: {
          id: x.role,
          name: roleQueryResult.name,
        },
      };
    })
  );

  res.json({
    status: true,
    content: {
      meta: {
        total: result.length,
        pages: pages,
        page: 1,
      },
      data,
    },
  });

  // res.json({
  //   status: true,
  //   content: {
  //     meta: {
  //       total: result.length,
  //       pages: pages,
  //       page: 1,
  //     },
  //     data: members.map((x) => ({
  //       id: x._id,
  //       community: x.community,
  //       user: {
  //         id: x.user,
  //         name: User.findById(x.user),
  //       },
  //       role: {
  //         id: x.role,
  //         name: Role.findById(x.role),
  //       },
  //     })),
  //   },
  // });
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
    throw new Error("Community with provided name already in existence");
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
