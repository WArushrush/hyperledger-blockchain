/**
 * Sample transaction processor function.
 * @param {org.example.empty.Order} tx The sample transaction instance.
 * @transaction
 */
async function Order(tx){
    //下单
    tx.mc.commidToDeliver[tx.mc.index] = tx.num;//对应商家添加订单，订单号对应到商品
    tx.mc.cust[tx.mc.index] = tx.ct;            //订单号对应到客户
    tx.mc.plat[tx.mc.index] = tx.pt;            //订单号对应到平台
    tx.mc.index += 1;                           //对应商家订单总数加一
    tx.ct.deposit -= tx.mc.commodities[tx.num]+Math.sqrt((tx.mc.x-tx.x)*(tx.mc.x-tx.x)+(tx.mc.y-tx.y)*(tx.mc.y-tx.y));//对应客户付款
    tx.pt.deposit += tx.mc.commodities[tx.num]+Math.sqrt((tx.mc.x-tx.x)*(tx.mc.x-tx.x)+(tx.mc.y-tx.y)*(tx.mc.y-tx.y));//对应平台收款
    tx.pt.domer[tx.pt.Total]=tx.mc;
    tx.pt.docus[tx.pt.Total]=tx.ct;
    tx.pt.state[tx.pt.Total]="Unfinished";
    tx.pt.Total +=1;
    const assetRegistry1 = await getAssetRegistry('org.example.empty.Merchant');//等待更新
    await assetRegistry1.update(tx.mc);
    const assetRegistry2 = await getAssetRegistry('org.example.empty.Platform');
    await assetRegistry2.update(tx.pt);
    const assetRegistry3 = await getAssetRegistry('org.example.empty.Customer');
    await assetRegistry3.update(tx.ct);
  }

  /**
   * Sample transaction processor function.
   * @param {org.example.empty.Deliver} tx The sample transaction instance.
   * @transaction
   */
  async function Deliver(tx){
    //送货
    tx.mc.index -= 1;//商家对应的商品数减1
    //let num = tx.mc.commidToDeliver[tx.mc.index];
    //let ct = tx.mc.cust[tx.mc.index];
    let num=tx.mc.commidToDeliver[0];//取出第一个要送的商品，对应顾客和对应平台
    let ct = tx.mc.cust[0];
    let pt = tx.mc.plat[0];
    //所有订单号对应的商品，顾客和平台都前移一个
    //删除最后一个订单信息
    tx.mc.commidToDeliver.shift();
    tx.mc.cust.shift();
    tx.mc.plat.shift();
    //对应平台要付的货款加1，对应到对应的货款和商家
    pt.commidToPay[pt.index] = tx.mc.commodities[num];
    pt.merc[pt.index] = tx.mc;
    pt.index += 1;
    //对应客户拥有的货物
    ct.commodities[ct.index] = tx.mc.comname[num];
    ct.index +=1;
    //等待更新
    const assetRegistry1 = await getAssetRegistry('org.example.empty.Merchant');
    await assetRegistry1.update(tx.mc);
    const assetRegistry2 = await getAssetRegistry('org.example.empty.Platform');
    await assetRegistry2.update(pt);
    const assetRegistry3 = await getAssetRegistry('org.example.empty.Customer');
    await assetRegistry3.update(ct);
  }
  /**
   * Sample transaction processor function.
   * @param {org.example.empty.Pay} tx The sample transaction instance.
   * @transaction
   */
async function Pay(tx){
    tx.pt.deposit-=tx.pt.commidToPay[0];//平台支付货款
    tx.pt.merc[0].deposit+=tx.pt.commidToPay[0];//商家收款
    tx.pt.state[tx.pt.Finish]="Finished";
    tx.pt.Finish +=1;
    const assetRegistry1 = await getAssetRegistry('org.example.empty.Merchant');
    await assetRegistry1.update(tx.pt.merc[tx.pt.index-1]);
    tx.pt.merc.shift();
    tx.pt.commidToPay.shift();
    tx.pt.index-=1;//平台待支付价款减一
    const assetRegistry2 = await getAssetRegistry('org.example.empty.Platform');
    await assetRegistry2.update(tx.pt);
  }
  /**
   * Sample transaction processor function.
   * @param {org.example.empty.logistics} tx The sample transaction instance.
   * @transaction
   */
  async function logistics(tx){
    console.log("commodity transfer successful");
  }
/**
   * Sample transaction processor function.
   * @param {org.example.empty.query_customer} tx The sample transaction instance.
   * @transaction
   */
  async function query_customer(tx){
    let assetRegistry1 = await getAssetRegistry('org.example.empty.Customer');
   let resource = await assetRegistry1.getAll();
   let l = resource.length;
   var money=0;
   for(let i=0; i<l;i++){
      if(resource[i].ID==tx.ID){
       	money=resource[i].deposit; 
      }
   }
  console.log(money);
  return money;
  }
