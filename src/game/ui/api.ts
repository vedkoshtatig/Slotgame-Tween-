const fetchBal=async(currBal:number,bet:number)=>{
    console.log(currBal,bet)
    const data=await fetch('http://localhost:8000/getBalance',{
        method:"Post",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            currBal: currBal,
            bet: bet
        })
    })

    const pdata=await data.json()
    return pdata
}

export default fetchBal
