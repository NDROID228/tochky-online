function useRandomNumbers() {
  const generateRandomNumbers = () => {
    let firstNumber = Math.floor(Math.random() * 10) + 1;

    let secondNumber = Math.floor(Math.random() * 11);
    let thirdNumber = Math.floor(Math.random() * 11);
    let fourthNumber = Math.floor(Math.random() * 11);

    return [firstNumber, secondNumber, thirdNumber, fourthNumber];
  };

  const randomNumbers = generateRandomNumbers();
  const concatenatedNumber = parseInt(randomNumbers.join(""));
  
  return {
    concatenatedNumber,
  };
}

export default useRandomNumbers;
