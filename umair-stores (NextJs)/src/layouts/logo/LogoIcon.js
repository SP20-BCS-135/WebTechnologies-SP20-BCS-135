import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import LogoDark from "../../../public/store.png";

const LogoIcon = () => {
  return (
    <Link href="/">
      <Image src={LogoDark} alt={LogoDark} width={200} height={50} />
    </Link>
  );
};

export default LogoIcon;
