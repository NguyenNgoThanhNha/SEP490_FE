import React from "react";
import { ToolbarProps, View } from "react-big-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/types/staff-calendar.type";
import { Button } from "../atoms/ui/button";

const CustomToolbar: React.FC<ToolbarProps<Event>> = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const handleViewChange = (view: unknown) => {
    toolbar.onView(view as View);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <button onClick={goToBack} aria-label="Previous">
        <ChevronLeft className="h-6 w-6 text-[#75752F]" />
      </button>

      <span className="text-lg font-semibold">{toolbar.label}</span>

      <button onClick={goToNext} aria-label="Next">
        <ChevronRight className="h-6 w-6 text-[#75752F]" />
      </button>

      <div className="flex space-x-2 ml-4">
        <Button
          onClick={() => handleViewChange("month")}
          className={`px-3 py-1 ${toolbar.view === "month" ? "bg-[#F5F5DC] text-[#4B4B11]" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          Month
        </Button>
        <Button
          onClick={() => handleViewChange("week")}
          className={`px-3 py-1 ${toolbar.view === "week" ? "bg-[#F5F5DC] text-[#4B4B11]" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          Week
        </Button>
        <Button
          onClick={() => handleViewChange("day")}
          className={`px-3 py-1 ${toolbar.view === "day" ? "bg-[#F5F5DC] text-[#4B4B11]" : "bg-gray-200 text-gray-800"}`}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

export default CustomToolbar;
