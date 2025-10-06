import { useEffect, useState } from 'react';
import './App.css'

function App() {

  const [gold_rate, setGold_rate] = useState("");
  const [labour_rate, setLabour_rate] = useState("");
  const [gst_rate, setGst_rate] = useState("");
  const [status, setStatus] = useState("");
  const SHOPIFY_STORE =  import.meta.env.VITE_SHOPIFY_STORE_NAME
  const ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_APP_ACCESS_TOKEN

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    try{

      // await updateShopifyMetafield("pricing", "gold_rate", gold_rate, "number_decimal");
      // await updateShopifyMetafield("pricing", "labour_rate", labour_rate, "number_decimal");
      // await updateShopifyMetafield("pricing", "gst_rate", gst_rate, "number_decimal");

        
      await fetch("https://pas-server-umber.vercel.app/api/updatePrices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gold_rate, labour_rate, gst_rate })
      });

      setStatus("Rates updated successfully!");
    }
    catch (err) {
      console.error(err);
       setStatus("❌ Error updating rates!");
    }
  };

    // async function updateShopifyMetafield(namespace, key, value, type) {
    //   await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/metafields.json`, {
    //     method: "POST",
    //     headers: {
    //       "X-Shopify-Access-Token": ACCESS_TOKEN,
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       metafield: {
    //         namespace,
    //         key,
    //         value: value.toString(),
    //         type
    //       }
    //     })
    //   });
    // }

//       async function updateAllProducts(gold_rate, labour_rate, gst_rate) {
//   console.log("Starting product price update...");
  
//   let page = 1;
//   let hasMore = true;

//   while (hasMore) {
//     const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50&page=${page}&status=active`, {
//       headers: { "X-Shopify-Access-Token": ACCESS_TOKEN }
//     });
    
//     const data = await res.json();
//     if (!data.products || data.products.length === 0) {
//       hasMore = false;
//       break;
//     }

//     for (const product of data.products) {
//       try {
//         // Fetch product metafields
//         const metaRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/products/${product.id}/metafields.json`, {
//           headers: { "X-Shopify-Access-Token": ACCESS_TOKEN }
//         });
//         const { metafields } = await metaRes.json();

//         const gold_weight = parseFloat(metafields.find(m => m.key === "gold_weight")?.value || 0);
//         const diamond_price = parseFloat(metafields.find(m => m.key === "diamond_price")?.value || 0);
//         const diamond_weight = parseFloat(metafields.find(m => m.key === "diamond_weight")?.value || 0);
//         const total_weight = gold_weight + diamond_weight;

//         // Formula
//         const goldPrice = gold_rate * gold_weight;
//         const labourPrice = labour_rate * total_weight;
//         const basePrice = goldPrice + labourPrice + diamond_price;
//         const finalPrice = basePrice + (basePrice * gst_rate / 100);

//         if (product.variants && product.variants.length > 0) {
//           const variantId = product.variants[0].id;

//           // Update price
//           const updateRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-10/variants/${variantId}.json`, {
//             method: "PUT",
//             headers: {
//               "X-Shopify-Access-Token": ACCESS_TOKEN,
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//               variant: {
//                 id: variantId,
//                 price: finalPrice.toFixed(2)
//               }
//             })
//           });

//           if (updateRes.ok) {
//             console.log(`✅ Updated ${product.title} → ₹${finalPrice.toFixed(2)}`);
//           } else {
//             console.log(`⚠️ Failed to update ${product.title}`);
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error updating product ${product.title}:`, err);
//       }
//     }

//     page++;
//   }

//   console.log("All active products updated successfully!");
// }

  return (
    <div className="rate-container">
      <h2>Update Today’s Rates</h2>

      <form onSubmit={handleSubmit} className="rate-form">
        <div className="form-group">
          <label>Gold Rate (₹/gm):</label>
          <input
            type="number"
            value={gold_rate}
            onChange={(e) => setGold_rate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Labour Rate (₹/gm):</label>
          <input
            type="number"
            value={labour_rate}
            onChange={(e) => setLabour_rate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>GST (%):</label>
          <input
            type="number"
            value={gst_rate}
            onChange={(e) => setGst_rate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  )
}

export default App;
