from ape import accounts, project


def main():
    deployer = accounts.load("brave")
    deployer.set_autosign(True)
    project.avs.deploy(sender=deployer, publish=True)
