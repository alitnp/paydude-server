import mongoose from "mongoose";
import axios from "axios";

const currencySchema = new mongoose.Schema({
	name: { type: String, required: true },
	rate: { type: Number, required: true, default: 0.0 },
	date: { type: Date, default: Date.now() },
});

const Currency = mongoose.model("Currency", currencySchema);

async function getRates() {
	const rates = await axios.get(
		"https://api.currencyfreaks.com/latest?apikey=d4acd950ce424db2a3afa44e97529355"
	);
	const { data } = await axios.get("https://www.megaweb.ir/api/money");
	rates.data.rates["rial"] = data.sell_usd.price.replace(",", ".");

	return rates.data.rates;
}

async function updateNeeded() {
	const currency = await Currency.findOne();

	if (currency === null) return true;

	const difference = (
		Math.abs(new Date() - new Date(currency.date)) / 3600000
	).toFixed(3);

	if (difference > 12) return true;

	return false;
}

async function updateRates() {
	await Currency.deleteMany();
	const ratesList = await getRates();
	for (const key in ratesList) {
		const currency = new Currency({ name: key, rate: ratesList[key] });
		await currency.save();
	}
}

export async function rates() {
	if (updateNeeded()) await updateRates();

	const rates = await Currency.find().select("-_id -date -__v");
	console.log(rates[rates.length - 1]);
	return rates;
}

export default Currency;
