import asyncHandler from "../middleware/asyncHandler.js";
import Community from "../models/communityModel.js";
import Member from "../models/memberModel.js";
import Role from "../models/roleModel.js";
import User from "../models/userModel.js";

const addMember = asyncHandler(async (req, res) => {
  const { community, user, role } = req.body;
  const comm = await Community.findById(community);
  const usr = await User.findById(user);
  const r = await Role.findById(role);
  const u = await Member.findOne({ user, community });

  if (!u) {
    if (comm.owner.toString() == req.user._id.toString()) {
      if (!comm || !usr || !r) {
        res.status(400);
        throw new Error("User/Community does'nt exist or Invalid role name");
      } else {
        const member = new Member({
          community,
          user,
          role,
        });
        const createdMember = await member.save();
        res.status(201).json({
          status: true,
          content: {
            data: createdMember,
          },
        });
      }
    } else {
      res.status(401);
      throw new Error("You can't perform this action");
    }
  } else {
    res.status(401);
    throw new Error(
      "Member already exists in the community for the given role"
    );
  }
});

const removeMember = asyncHandler(async (req, res) => {
  const { community } = req.body;
  const member = await Member.findOne({ user: req.params.id, community });
  const admin = await Community.findOne({ _id: member.community });
  if (admin.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  } else {
    if (member) {
      await member.deleteOne({ _id: member._id });
      res.json({ status: true });
    } else {
      res.status(404);
      throw new Error("Member not found");
    }
  }
});

export { addMember, removeMember };
