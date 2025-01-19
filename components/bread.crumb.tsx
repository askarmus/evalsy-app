import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

export const Breadcrumb = () => (
  <Breadcrumbs
    itemClasses={{
      separator: "px-2",
    }}
    separator="/"
  >
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Music</BreadcrumbItem>
    <BreadcrumbItem>Artist</BreadcrumbItem>
    <BreadcrumbItem>Album</BreadcrumbItem>
    <BreadcrumbItem>Song</BreadcrumbItem>
  </Breadcrumbs>
);
