import React from "react";
import pages from "../res/lib/pages.js";

const Page= ({ _name })=>{

  console.log();

  return (
    <div className="container-fluid px-0 mx-0 overflow-hidden page-start">
       {pages[_name] ? pages[_name]() : <h1>PAGE NOT FOUND</h1>}
    </div>
  );
}

export default Page;