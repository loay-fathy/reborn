import React from "react";
import { ArrowUp, ArrowDown, Banknote, LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string;
  countText: string;
  percentage?: number;
  isPositive?: boolean;
  icon?: LucideIcon;
}

const DataCard = ({
  title = "Today's Sales",
  value = "$4,850",
  countText = "245 orders completed",
  percentage,
  isPositive,
  icon: Icon = Banknote,
}: DataCardProps) => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#BC742833] p-2 rounded-xl">
          {/* Icon scales slightly on larger screens */}
          <Icon className="text-main-color w-6 h-6 lg:w-[30px] lg:h-[30px]" />
        </div>
        {percentage && (
          <div
            className={`flex items-center gap-1 font-semibold text-sm lg:text-base ${isPositive ? "text-green-500" : "text-red-500"
              }`}
          >
            {isPositive ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            <p>{Math.abs(percentage)}%</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm lg:text-base text-secondary-color font-medium">
          {title}
        </p>
        {/* Text size increases on large screens */}
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {value}
        </h3>
        <p className="text-xs lg:text-sm text-secondary-color/80">
          {countText}
        </p>
      </div>
    </div>
  );
};

export default DataCard;
