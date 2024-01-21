const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { User } = require("../../models/user");

const avatarDir = path.join(__dirname, "../", "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const uploadedImage = await Jimp.read(tempUpload);
    const resizedImage = uploadedImage.resize(250, 250);
    const uniqueFileName = `${_id}_${Date.now()}_${filename}`;
    const resultUpload = path.join(avatarDir, uniqueFileName);
    await resizedImage.writeAsync(resultUpload);
    const avatarURL = path.join("avatars", uniqueFileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    await fs.unlink(tempUpload);

    res.status(200).json({ code: 200, avatarURL });
  } catch (error) {
    console.error("Error in updateAvatar:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
};

module.exports = updateAvatar;
