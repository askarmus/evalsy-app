import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

export const Breadcrumb = ({ items }) => (
  <Breadcrumbs
    itemClasses={{
      separator: "px-2",
    }}
    separator="/"
  >
    {items.map((item, index) =>
      index === items.length - 1 ? (
        <BreadcrumbItem key={index}>{item.name}</BreadcrumbItem>
      ) : (
        <BreadcrumbItem key={index} href={item.link}>
          {item.name}
        </BreadcrumbItem>
      )
    )}
  </Breadcrumbs>
);
