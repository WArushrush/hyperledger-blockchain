# Our Order

This business network defines:

**Participant**
`Person`

**Asset**
`Customer`
`Merchant`

**Transaction**
`Order`
`Deliver`
`Pay`
`logistics`

Assets are owned by a Participant, and the value property on a Asset can be modified by submitting a Transaction. 

To test this Business Network Definition in the **Test** tab:

Create a`Person` participant:

```
{
  "$class": "org.example.empty.Person",
  "ID": "1",
  "Name": "Toby"
}
{
    "$class": "org.example.empty.Person",
    "ID": "2",
    "Name": "Bob"
}
```

Create a`Customer`asset:

```
{
  "$class": "org.example.empty.Customer",
  "ID": "1",
  "owner": "resource:org.example.empty.Person#1",
  "deposit": "original value",
  "commidToPay": [],
  "index":0,
  "merc":"resource:org.example.empty.Merchant#2"
}
```

Create a`Merchant`asset:

```
{
    "$class": "org.example.empty.Merchant",
    "ID": "2",
    "owner": "resource:org.example.empty.Person#2",
    "deposit": "original value",
    "commidties": [],
    "index":0,
    "cust":"resource:org.example.empty.Customer#1",
    "commidToDeliver":[]
}
```

Submit a `Order` transaction:

```
{
  "$class": "org.example.empty.Order",
  "ct": "resource:org.example.empty.Customer#ID:1",
  "mc": "resource:org.example.empty.Merchant#ID:2",
  "num": "num of the commidity"
}
```

Submit a `Deliver` transaction:

```
{
    "$class": "org.example.empty.Deliver",
    "mc": "resource:org.example.empty.Merchant#ID:2",

}
```

Submit a `Pay` transaction:

```
{
    "$class": "org.example.empty.Pay",
    "ct": "resource:org.example.empty.Customer#ID:1",

}
```
Because our contract uses "index" to find the next commidity for our merchant to send as well as the next commidity for our customer to pay to complete the "Deliver" and "Pay" process , we do not need to pass any extra parameter. That is to say, in "Order" process, when a merchant receives an order, his "index" increases by 1 automatically while after he sends a good in "Deliver" process, his "index" would decrease by 1. Same method for our customer in "Pay" process.
After submitting this transaction, you should now see the transaction in the Transaction Registry and our 'logistics' would inform you have successfully completed your entire trade. As a result, in the Asset Registry, the value of the `deposit` in our customer would decrease by the amount of money in merchant's commidities[num] while the `deposit` in our merchant would increase by the same amount .

Congratulations!

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
