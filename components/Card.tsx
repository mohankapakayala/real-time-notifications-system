import { memo } from "react";
import { CardProps } from "@/types";
import "@/app/components.css";

const Card = memo(function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 border-default ${className}`}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
