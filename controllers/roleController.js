import asyncHandler from "../middleware/asyncHandler.js";
import Role from "../models/roleModel.js";

const createRole = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const r = await Role.findOne({ name });
  if (!r) {
    if (!name) {
      res.status(400);
      throw new Error("Must choose the role");
    } else {
      const role = new Role({
        name,
      });
      const createdRole = await role.save();
      res.status(201).json({
        status: true,
        content: {
          data: createdRole,
        },
      });
    }
  } else {
    res.status(400);
    throw new Error("Role already exists");
  }
});

const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({}).sort({ createdAt: -1 });
  const pages = Math.ceil(roles.length / 10);
  res.json({
    status: true,
    content: {
      meta: {
        total: roles.length,
        pages: pages,
        page: 1,
      },
      data: roles,
    },
  });
});

export { createRole, getAllRoles };
