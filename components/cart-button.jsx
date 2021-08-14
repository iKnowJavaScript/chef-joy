function CartButton({ count }) {
  if (count)
    return (
      <div className="flex">
        <span className="flex items-center h-10 w-auto border border-black px-6 font-medium rounded-lg">
          <button className="text-lg font-semibold text-red-600 mr-4">
            {"+"}
          </button>{" "}
          {count}{" "}
          <button className="text-lg font-semibold text-red-600 ml-4">
            {"-"}
          </button>
        </span>
      </div>
    );

  return (
    <button className="h-10 border border-black px-7 font-medium rounded-lg">
      <span className="font-semibold text-red-600">+</span> ADD
    </button>
  );
}

export default CartButton;
