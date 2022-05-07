# IBM Cloud-specific imports
from cloudant.client import Cloudant
from cloudant.error import CloudantException
import requests


# main() will be run automatically when this action is invoked in IBM Cloud
def main(dict):

    client = Cloudant.iam(
        account_name=dict["COUCH_USERNAME"],
        api_key=dict["IAM_API_KEY"],
        url=dict["COUCH_URL"],
        connect=True,
    )

    my_database = client["reviews"]
    print(my_database)

    try:
        selector = {'dealership': {'$eq': int(dict["dealerId"])}}
        result_by_filter = my_database.get_query_result(
            selector, raw_result=True)

        result = {
            'headers': {'Content-Type': 'application/json'},
            'body': {'data': result_by_filter}

        }
        return result
    except:

        return {
            'statusCode': 404,
            'message': "Something went wrong"
        }