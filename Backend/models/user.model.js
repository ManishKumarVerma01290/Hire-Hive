import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,

    role: {
      type: String,
      enum: ["Student", "Recruiter"],
      default: "Student",
      required: true,
    },

    profile: {
      bio: {
        type: String,
      },

      skills: [
        {
          type: String,
        },
      ],

      resume: {
        type: String,
      },

      profilePhoto: {
        type: String,
        default: "",
      },

      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },

      aiAnalysis: {
        type: String,
        default: "",
      },

      aiScore: {
        type: Number,
        default: 0,
      },

      suggestedSkills: [
        {
          type: String,
        },
      ],
    },

    termsAcceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);