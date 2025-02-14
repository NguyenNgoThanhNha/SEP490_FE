const InfoCard = ({
  title,
  value,
  description,
  icon,
  bgColor,
  iconBgColor,
}: {
  title: string;
  value: string;
  description: string;
  icon: JSX.Element;
  bgColor: string;
  iconBgColor: string
}) => {
  return (
    <div className={`flex flex-col p-6 rounded-lg shadow-md ${bgColor}`}>
      <div className={`mb-4 mr-4 flex items-center justify-center w-12 h-12 rounded-full ${iconBgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold mb-2">{value}</p>
        <h3 className="text-lg mb-2">{title}</h3>
        <p className="font-medium text-[#4079ED]">{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
