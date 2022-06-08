import { useEffect, useState } from 'react'
import Web3 from 'web3'
import factoryABI from '../constants/abi/factory.json'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import MyModal from './Modal'
export default function Creator() {
  const contractAddress = '0xF76ffd184421aB715eB09aF543c8f73Df5fE38A1'
  const web3 = new Web3('https://liberty10.shardeum.org')

  const [name, setName] = useState()
  const [symbol, setSymbol] = useState()
  const [supply, setSupply] = useState()
  const [status, setStatus] = useState(false)
  const [tokenAddress, settokenAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleInputName(e) {
    setName(e.target.value)
    console.log(name)
  }
  function handleInputSymbol(e) {
    setSymbol(e.target.value)
    console.log(name)
  }
  function handleInputMaxSupply(e) {
    setSupply(e.target.value)
    console.log(name)
  }

  const handleCreateToken = async () => {
    setIsSubmitting(true)
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(accounts)

    const factoryContract = new ethers.Contract(
      contractAddress,
      factoryABI,
      provider,
    )

    const factoryContractWithSigner = factoryContract.connect(signer)
    const tx = await factoryContractWithSigner.createToken(
      name,
      symbol,
      ethers.utils.parseEther(supply),
      { value: ethers.utils.parseEther('0.1') },
    )
    console.log('Receipt', tx)
    const receipt = await tx.wait()
    console.log(receipt)
    if (receipt.status == 1) {
      setStatus(true)
      settokenAddress(receipt.events[0].args[0])
      console.log(status)
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      setStatus(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="min-h-1/2 bg-gray-900  border border-gray-900 rounded-2xl">
        <div className="mx-4 sm:mx-24 md:mx-34 lg:mx-56 mx-auto  flex items-center space-y-4 py-16 font-semibold text-gray-500 flex-col">
          <h1 className="text-white text-2xl">Create New Token</h1>
          <input
            onChange={(e) => handleInputName(e)}
            className="w-full p-2 bg-gray-900 rounded-md  border border-gray-700 focus:border-blue-700"
            placeholder="Name Of Token"
            type="text"
            name="correo"
            id=""
          />
          <input
            className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 "
            onChange={(e) => handleInputSymbol(e)}
            placeholder="Token Symbol"
            type="text"
            name="Token Symbol"
            id=""
          />
          <input
            className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 "
            onChange={(e) => handleInputMaxSupply(e)}
            placeholder="Token Max Supply"
            type="number"
            name="Token Max Supply"
            id=""
          />
          <input
            className="w-full p-2 bg-gray-900 rounded-md border border-gray-700 "
            placeholder="Decimals 18"
            text="18"
            type="number"
            name="Decimals 18"
            disabled="true"
            id=""
          />

          {isSubmitting ? (
            <button
              onClick={handleCreateToken}
              className="w-full p-2 bg-gray-50 rounded-full font-bold text-gray-900 border border-gray-700 "
              type="submit"
              name="Create Token"
              disabled="true"
              id=""
            >
              <svg
                role="status"
                class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-900"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleCreateToken}
              className="w-full p-2 bg-gray-50 rounded-full font-bold text-gray-900 border border-gray-700 "
              type="submit"
              name="Create Token"
              id=""
            >
              Create Token
            </button>
          )}
         

          <MyModal
            isOpen={status}
            setIsOpen={setStatus}
            tokenAddress={tokenAddress}
            symbol={symbol}
            message="Token Created Successfully At"
            isMetamask="true"
          />

          <p>
            Want to deploy your Own ?
            <a
              className="font-semibold text-sky-700"
              href="https://shardeum.org/blog/how-to-mint-your-cryptocurrency-on-shardeum-testnet/"
            >
              Read docs
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}