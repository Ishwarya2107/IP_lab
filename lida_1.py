from flask import Flask, render_template, request
import lida
from lida import Manager, TextGenerationConfig, llm


app = Flask(__name__)


lida = Manager(text_gen=llm("openai", api_key=""))


textgen_config = TextGenerationConfig(n=1, temperature=0.5, model="gpt-3.5-turbo", use_cache=True)
@app.route('/charts')
def charts():
    goal = request.args.get('goal')
    if not goal:
        return "Goal not provided", 400

    try:
        
        library = "matplotlib"
        summary = lida.summarize("/Users/ishwarya/Desktop/lida_main/report.csv", summary_method="default", textgen_config=textgen_config)
        
        
        charts = lida.visualize(summary=summary, goal=goal, textgen_config=textgen_config, library=library)
        chart_base64 = charts[0]  

        return render_template('dashboard.html', goal=goal, chart_base64=chart_base64)

    except Exception as e:
        return f"An error occurred: {str(e)}", 500



@app.route('/goals')
def index():

    summary = lida.summarize("/Users/ishwarya/Desktop/lida_main/report.csv", summary_method="default", textgen_config=textgen_config)
    goals = lida.goals(summary, n=5, textgen_config=textgen_config)
    print(goals)
  
    return render_template('dashboard.html', goal_list=goals)


@app.route('/')
def home():
    return render_template('dashboard.html')
if __name__ == '__main__':
    app.run(debug=True,port=5001)
