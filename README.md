# This library(construct, component..) creates EC2 instances given an already created AMI.

This AWS CDK project creates a CloudFormation Stack with the desired ec2 instance and all its dependencies such as security groups or key-pair.

Currently its props interface just requires the AMI name, the EC2 type and the vpc ID.

---

## Requirements
In order to run it you need to have installed in your pc:
- node.js >= 10.3
- AWS CLI installed (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- AWS credentials configured (Just run 'aws configure' in your terminal after above installation)
- npm install -g aws-cdk

## Execution

In order to run it follow these steps:
 * `npm run build`
 * `cdk bootstrap`
 * `cdk synth`
 * `cdk deploy`

Wait a few minutes and it will be printed the IP of the ec2 created in the terminal if everything has gone well!

Remember that the credentials to access to the new instance created are the ones used to create the already existing AMI.

## Termination of all created AWS resources

Run:
 * `cdk destroy`

