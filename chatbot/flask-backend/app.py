from flask import Flask, jsonify, request
import json

app = Flask(__name__)

# Load responses from JSON file
responses = { "Why is my electricity bill high? 🤔": "High electricity bills can be due to various factors such as inefficient appliances, high usage during peak hours, or poor insulation in your home.", "How can I reduce my electricity consumption? 🌱": "You can reduce electricity consumption by using energy-efficient appliances, turning off lights and appliances when not in use, and using programmable thermostats.", "What are the most power-consuming appliances? 🔌": "Some of the most power-consuming appliances include air conditioners, heaters, refrigerators, and washing machines.", "Tips for saving electricity? 💡": "Some tips for saving electricity include using LED bulbs, unplugging devices when not in use, and using energy-efficient appliances.", "How does my current usage compare to previous months?": "Reviewing your historical data can show trends and patterns. For instance, if your usage has spiked this month compared to the last, it might indicate increased use of heating or cooling appliances.", "Which appliances or activities are using the most electricity?": "Identifying energy-hungry devices like air conditioners, heaters, and large household appliances can help you target specific areas for energy-saving measures.", "Are there any peak usage times, and why?": "Understanding peak times helps in managing and potentially reducing usage during those hours. Peaks might be due to higher usage during evenings when everyone is home." }

@app.route('/get_response', methods=['POST'])
def get_response():
    data = request.get_json()
    question = data.get('question')
    response = responses.get(question, "Sorry, I don't have an answer for that.")
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    return jsonify(response=response), response_headers

if __name__ == "__main__":
    app.run(debug=True)