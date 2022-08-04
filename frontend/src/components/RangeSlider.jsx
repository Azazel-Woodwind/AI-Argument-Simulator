const RangeSlider = ({ min, max, value, onChange }) => {
  return (
    <>
      <input
        type="range"
        step="0.01"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />{" "}
      {value}
    </>
  );
};

export default RangeSlider;
