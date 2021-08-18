import Down from "./down.svg";

function ChSelectField({
  options = [],
  defaultOption = { name: "Select", value: "" },
}) {
  return (
    <div>
      <div className="relative">
        <select className="md:text-base text-sm focus:outline-none appearance-none">
          {defaultOption && (
            <option value={defaultOption.value}>{defaultOption.name}</option>
          )}

          {options.length &&
            options.map((value, name) => <option value={value}>{name}</option>)}
        </select>

        <Down className="absolute right-0 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  );
}

export default ChSelectField;
