import { useState } from "react";

import ChefCard from "../chef-card";
import ChButton from "../base/ch-button";
import GridToScroll from "../grid-to-scroll";
import useSWR from "swr";
import { fetchTrendingChefs } from "../../services/chef-api";

function TrendingChefs() {
  const { data, error } = useSWR("fetch_trending_chefs", fetchTrendingChefs);

  return (
    <section className="w-11/12 mx-auto md:pt-44 pt-32">
      <h2 className="md:text-4xl text-2xl font-semibold md:text-center md:mb-4 mb-2">
        Trending Chefs
      </h2>

      <div className="flex justify-center mb-10">
        <p className="md:text-center md:text-lg text-sm md:w-4/12 text-gray-500">
          Browse the chefs in demand and plan your next meal or party.
        </p>
      </div>

      <GridToScroll gridCols={3} gapX={8}>
        {data?.map((chef, index) => {
          return (
            <ChefCard
              chef={{ ...chef, link: `/chef/profile/${chef.id}` }}
              key={index}
              className="mb-14"
              style={{ flex: "0 0 auto" }}
            />
          );
        })}
      </GridToScroll>

      {data?.length > 3 && (
        <div className="flex justify-center md:mt-16 mt-8">
          <ChButton className="bg-black text-white py-3 px-7 font-medium">
            45 More Chefs
          </ChButton>
        </div>
      )}
    </section>
  );
}

export default TrendingChefs;
