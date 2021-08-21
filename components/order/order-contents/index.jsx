import React from "react";
import Link from "next/link";

import OrderChefInfo from "../order-chef-info";
import OrderContent from "./order-content";

function OrderContents() {
  return (
    <div>
      <OrderChefInfo className="flex items-center border-b pb-5 mb-5" />

      <OrderContent />

      <div className="flex md:justify-start justify-center md:mt-14 mt-12">
        <Link href="/chef/profile">
          <a className="md:absolute border border-black rounded-lg py-3 px-5  font-medium">
            <span className="text-lg">+</span> Add More Dishes
          </a>
        </Link>
      </div>
    </div>
  );
}

export default OrderContents;
