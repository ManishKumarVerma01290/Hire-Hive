import React, { useState } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/data";

 
const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isResume = !!user?.profile?.resume;
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const analyzeResume = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${USER_API_END_POINT}/analyze-resume`,
        {},
        {
          withCredentials: true,
        }
      );

      setAiResult(res.data.result);
      toast.success("Resume analyzed successfully");
    } catch (error) {
      toast.error("AI Analysis failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4 sm:p-8 shadow shadow-gray-400 hover:shadow-yellow-400 w-[95%] sm:w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full sm:w-auto text-center sm:text-left">
            <Avatar className="cursor-pointer h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt="@shadcn"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl mt-2 sm:mt-0">{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right self-end sm:self-auto"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2 break-all">
            <Mail className="shrink-0" />
            <span className="">
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </span>
          </div>
          <div className="flex items-center gap-3 my-2 break-all">
            <Contact className="shrink-0" />
            <span className="">
              <a href={`tel:${user?.phoneNumber}`}>{user?.phoneNumber}</a>
            </span>
          </div>
        </div>

        <div>
          <div className="my-5">
            <h1>Skills</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {user?.profile?.skills.length !== 0 ? (
                user?.profile?.skills.map((item, index) => (
                  <Badge key={index}>{item}</Badge>
                ))
              ) : (
                <span>NA</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
          <label className="text-md font-bold"> Resume / Portfolio </label>
          {isResume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.profile?.resume}
              className="text-blue-500 w-full hover:underline cursor-pointer"
            >
              View Resume/Portfolio
            </a>
          ) : (
            <span>No Link Provided</span>
          )}
        </div>
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={analyzeResume} disabled={loading}>
          {loading ? "Analyzing..." : "🤖 Analyze Resume"}
        </Button>
      </div>

      {aiResult && (
        <div className="mt-6 bg-white border rounded-xl p-5 shadow">
          <h2 className="text-xl font-bold">
            ATS Score: {aiResult.score}/100
          </h2>

          <p className="mt-4">{aiResult.analysis}</p>

          <div className="mt-5">
            <h3 className="font-semibold">Suggested Skills</h3>

            <div className="flex flex-wrap gap-2 mt-2">
              {aiResult.suggestedSkills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl w-[95%] sm:w-full">
        <h1 className="text-lg my-5 font-bold">Applied Jobs</h1>

        {/* Add Application Table */}
        <AppliedJob />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
