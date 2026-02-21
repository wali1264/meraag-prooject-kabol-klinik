import { GoogleGenAI } from "@google/genai";
import { Transaction, InventoryStats, Customer } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBusinessInsight = async (
  stats: InventoryStats,
  recentTransactions: Transaction[],
  customers: Customer[]
): Promise<string> => {
  if (!apiKey) {
    return "کد API تنظیم نشده است. لطفاً متغیر محیطی API_KEY را برای استفاده از هوش مصنوعی تنظیم کنید.";
  }

  try {
    const prompt = `
      As a senior business analyst for a petrol station business in Afghanistan (PetroAccount AF), analyze the following data and provide a brief, high-level strategic insight (max 3 sentences) in Dari/Persian language on how to improve profit or manage stock better.
      
      Currency: AFN.
      Current Stock: ${stats.currentStock} Liters.
      Average Buy Price: ${stats.avgBuyPrice} AFN.
      Total Sales (Today): ${stats.totalSalesValue} AFN.
      Net Profit: ${stats.profit} AFN.
      Customer Count: ${customers.length}.
      Recent Transaction Count: ${recentTransactions.length}.
      
      Focus on actionable advice regarding pricing, stock levels, or customer engagement. Answer strictly in Dari/Persian.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "در حال حاضر هیچ بینشی موجود نیست.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "به دلیل خطای ارتباط، در حال حاضر امکان تولید بینش وجود ندارد.";
  }
};