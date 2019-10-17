from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
import requests
from flask_cors import CORS, cross_origin

df_interpolate = pd.read_csv('data_interpolate_escape.csv')

def predictions(input):
    filtered = df_interpolate[df_interpolate['clean_titles'] == input]
    cluster = filtered['cluster3'].values[0]
    movies = df_interpolate[df_interpolate['cluster3'] == cluster]
    if len(movies) < 6:
        movies = df_interpolate[(df_interpolate['cluster3'] == cluster) | 
                                (df_interpolate['cluster3'] == cluster+1) |
                                (df_interpolate['cluster3'] == cluster-1)]
    else:
        movies = df_interpolate[df_interpolate['cluster3'] == cluster]
    if input in movies['clean_titles'].tolist():
        all = movies
    else:
        all = pd.concat([filtered, movies], axis=0)
    if all['clean_titles'].tolist()[0] != input:
        all = all.reset_index(drop=True)
        ind = all.index[all['clean_titles'] == input].tolist()[0]
        m1, m2 = all.iloc[0].copy(), all.iloc[ind].copy()
        all.iloc[0], all.iloc[ind] = m2,m1
    if 'Unnamed: 0' in all.columns:
        all = all.drop(columns=['Unnamed: 0'])
    final = all.iloc[0:6]
    return final

def json_array(preds):
    output = {}
    dictionaries = []
    for i, movie in enumerate(preds['clean_titles']):
        for j in range(266):
            row_dict = dict({"percent": str(preds.columns[j]), "score": str(preds.iloc[i,j]), 
            "cluster": str(preds['cluster3'].values[i])})
            dictionaries.append(row_dict)
        movie_data = dict({movie: dictionaries})
        output.update(movie_data)
        dictionaries = []
    return output


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route('/')
    @app.route('/index')
    @app.route('/api', methods=['POST'])
    def make_predict():
        #get data
        data = request.get_json(force=True)
        #parse
        predict_request = data['movie_title']
        #preds

        preds = predictions(predict_request)
        #send back to browser
        output= json_array(preds)
        return output


    return app

