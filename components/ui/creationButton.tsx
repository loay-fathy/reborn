const CreationButton = ({
  text,
  icon,
  handleOnClick,
}: {
  text: string;
  icon: React.ReactNode;
  handleOnClick: () => void;
}) => {
  return (
    <button
      className="bg-main-color text-white font-semibold px-5 py-3 rounded-2xl hover:bg-main-color/90 cursor-pointer transition fixed bottom-10 left-1/6"
      onClick={handleOnClick}
    >
      <div className="flex items-center gap-2">
        <span>{text}</span>
        {icon}
      </div>
    </button>
  );
};

export default CreationButton;
