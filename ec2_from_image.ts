import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

/*
    - SUMMARY: 
        - This library creates an ec2 instance given its type and a AMI already created.
    
    - USE CASE: 
        - The idea is, for example, that a developer creates an ec2 instance in order to 
          test in prod or dev the artifact manually.
          Doing so he just defines one time the ec2 info and he can start and stop a fresh 
          ec2 with cdk commands.

    - Notes: 
        - The user and pass for accessing the instance should be the one created during the AMI creation.
        - The key-pair you pass to this class as property, is the one it was used to create the AMI.
        - In the case of windows AMIs, the windows user and password to connect using RDP is the one it was used to create the AMI.

    - How to use:
        - const testEc2 = new ec2FromImage(this, 'testEc2', {
            ami_name:'testImage',
            ec2_type: 't2.micro',
            vpc: 'vpc-d7b763b1'
          });
*/

export interface EnvProps{
    ec2_type: string;
    ami_name: string;
    vpc: string;
    CommandToExecuteOnStartup?: string
}

export class ec2FromImage extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: EnvProps) {
        super(scope, id);

        // Get VPC
        const vpc = ec2.Vpc.fromLookup(this,'vpcLook',{
            vpcId : props.vpc
        });

        // Open ports 
        const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc,
        securityGroupName: "my-test-sg",
        description: 'Allow ssh access to ec2 instances from anywhere',
        allowAllOutbound: true 
        });
        //mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow public SSH access')
        mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3389), 'allow public RDP access')

        const awsAMI = new ec2.LookupMachineImage({
            name : props.ami_name
        });
        awsAMI.getImage(this);

        const host = new ec2.Instance(this, 'ec2Prova',{
            vpc,
            machineImage: awsAMI,
            instanceType: new ec2.InstanceType(props.ec2_type),
            keyName: 'multi_use_key',
            securityGroup: mySecurityGroup
        });

        //Add option to ec2.UserData
        if(props.CommandToExecuteOnStartup != null){
            host.addUserData(props.CommandToExecuteOnStartup);
        }

        // print IP of ec2
        const c = new cdk.CfnOutput(this, "EC2 IP", {
            value : host.instancePublicIp,
            description : 'Public IP of new ec2 instance created: '
        });
            
    }
}
