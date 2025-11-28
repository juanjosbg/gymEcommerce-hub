"use client";

import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";

import ButtonCircle3 from "@/shared/Button/ButtonCircle3";

const SectionNavigation = () => {
  const [activeTab, setActiveTab] = useState("New Arrival");

  return (
    <div className="my-10 flex items-center justify-between">
      <Link to="/">
        <ButtonCircle3 size="w-10 h-10" className="border border-neutral-300">
          <MdArrowBack className="text-2xl" />
        </ButtonCircle3>
      </Link>
    </div>
  );
};

export default SectionNavigation;
