import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", onChange, onInput, ...props }, ref) => {
    // Hàm xử lý nhập liệu thời gian với điều kiện phút chẵn
    const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      // Kiểm tra định dạng giờ:phút (hh:mm)
      const regex = /^([0-9]{2}):([0-9]{2})$/;
      const match = val.match(regex);

      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);

        // Giới hạn giờ từ 9h sáng đến 9h tối và phút phải là số chia hết cho 5 (5, 10, 15, 20,...)
        if (
          hours >= 9 &&
          hours <= 21 &&
          minutes >= 0 &&
          minutes <= 55 &&
          minutes % 5 === 0
        ) {
          e.target.value = val; // Nếu hợp lệ, giữ lại giá trị nhập
        } else {
          e.target.value = ""; // Nếu không hợp lệ, xóa giá trị
        }
      } else {
        e.target.value = ""; // Nếu không đúng định dạng, xóa giá trị
      }

      onChange?.(e); // Gọi callback onChange nếu có
    };

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
      ...props,
      type,
      className: cn(
        "flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-md transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 focus-visible:outline-none",
        className
      ),
      ref,
    };

    if (type === "time") {
      return (
        <input
          {...inputProps}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={handleTimeInput} // Gọi hàm kiểm tra thời gian
        />
      );
    }

    return <input {...inputProps} onChange={onChange} onInput={onInput} />;
  }
);

Input.displayName = "Input";

export { Input };
