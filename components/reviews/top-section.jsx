import React from "react";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import Stargazer from "../stargazer";
import Styles from "../../pages/styles.module.css";
import { IMAGE_URL } from "../../constants/enviroment-vars";
import useUser from "../../custom-hooks/use-user";

function ReviewTopSection({ chef, totalReviews = 0, setShowReviewModal }) {
  const { user } = useUser();

  const handleAddReview = () => {
    if (user) {
      setShowReviewModal(true);
      return;
    }

    router.push("/login");
  };

  return (
    <div>
      <div className=" w-100 h-100 block pb-4 ">
        <span className="text-black">
          <small>
            Home <span>/</span>{" "}
          </small>

          <small>
            94601 <span>/</span>{" "}
          </small>

          <small>
            Party <span>/</span>{" "}
          </small>

          <small className="text-gray-400 capitalize">{chef?.fullName}</small>
        </span>

        <div className={Styles.media}>
          <div className="flex">
            <div className="relative rounded-full w-20 h-20 bg-gray-200">
              <Image
                src={`${IMAGE_URL}${chef.profilePic}`}
                className="rounded-full"
                alt="chef picture"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="inline-block ml-4 pt-1.5">
              <h1 className="font-bold text-xl capitalize">{chef?.fullName}</h1>

              <div className="flex h-8 items-center mt-1 space-x-3">
                <svg
                  id="Group_16073"
                  data-name="Group 16073"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    id="Path_19000"
                    data-name="Path 19000"
                    d="M0,0H24V24H0Z"
                    fill="none"
                  />
                  <circle
                    id="Ellipse_628"
                    data-name="Ellipse 628"
                    cx="3"
                    cy="3"
                    r="3"
                    transform="translate(9 8)"
                    fill="none"
                    stroke="#333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    id="Path_19001"
                    data-name="Path 19001"
                    d="M17.657,16.657,13.414,20.9a2,2,0,0,1-2.827,0L6.343,16.657a8,8,0,1,1,11.314,0Z"
                    fill="none"
                    stroke="#333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>

                <span className="md:text-sm text-xs">
                  {chef?.city?.name} {chef?.city?.stateCode}
                </span>

                <span className="text-red-600 md:text-sm text-xs underline">
                  {totalReviews} Reviews
                </span>
                <Stargazer stars={chef?.rating?.toFixed(1)} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href={`/chef/profile/${chef.id}`}>
              <a className="border border-black py-3 px-7 mt-6 font-medium md:text-base text-sm rounded-lg">
                Back to profile
              </a>
            </Link>

            <button
              className="bg-black text-white py-3 px-7 mt-6 ml-5 font-medium md:text-base text-sm rounded-lg"
              onClick={handleAddReview}
            >
              Add review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewTopSection;
